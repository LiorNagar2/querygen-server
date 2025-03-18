import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSQLQuery(naturalText: string, schema: any) {
    const compressedSchema = this.compressSchema(schema);
    const prompt = `Convert the following request into a SQL query using the schema provided.
  The query must only contain SELECT statements. Do NOT generate INSERT, UPDATE, DELETE, DROP, or ALTER queries.
  
  Schema:
  ${compressedSchema}

  Request: ${naturalText}`;

    const responseText = await this.sendRequest(prompt);
    const sql =  this.extractSQL(responseText);

    return sql;
  }

  compressSchema(fullSchema: Record<string, any>): string {
    let compressedSchema: Record<string, string[]> = {};

    Object.keys(fullSchema).forEach(table => {
      compressedSchema[table] = fullSchema[table].map((column: any) => {
        return `${column.name} (${column.type})`; // Format: "column_name (type)"
      });
    });

    return JSON.stringify(compressedSchema);
  }

  extractSQL(responseText) {
    // Match SQL code inside ```sql ... ```
    const match = responseText.match(/```sql\s*([\s\S]*?)\s*```/);

    if (match) {
      return match[1].trim(); // Return only the SQL query
    }

    // If no code block is found, try extracting the last SELECT statement
    const selectMatch = responseText.match(/SELECT\s+[\s\S]*?;/i);
    if (selectMatch) {
      return selectMatch[0].trim();
    }

    return ''; // Return empty string if no SQL is found
  }

  async sendRequest(prompt: string, max_tokens = 200){
    console.log('#######prompt', prompt);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: max_tokens,
    });

    console.log('########Response', response);

    return response.choices[0]?.message?.content?.trim();
  }
}
