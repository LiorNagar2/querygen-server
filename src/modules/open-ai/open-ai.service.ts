import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { DatabaseStructure } from '../database/database.service';

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

    const responseText = await this.sendRequest(prompt, 200);
    const sql = this.extractSQL(responseText);

    return sql;
  }

  async generateAnalyticsQueries(schema: DatabaseStructure): Promise<{ prompt: string, query: string }[]> {
    const compressedSchema = this.compressSchema(schema);
    const prompt = `
Based on the following database schema, generate 5 insightful SQL queries that are useful for analytics dashboards (like graphs or KPIs). 
Each should include a short title (prompt) and the SQL.
Return as JSON array like:
[{ "prompt": "...", "query": "..." }]
Schema: ${compressedSchema}
    `.trim();

    const response = await this.sendRequest(prompt, 1000);
    const queries = this.extractCode(response, 'json');

    try {
      return JSON.parse(queries);
    } catch {
      throw new Error('Invalid JSON from OpenAI response');
    }
  }

  compressSchema(schema: DatabaseStructure): string {
    let compressedSchema: Record<string, string[]> = {};

    Object.keys(schema).forEach(table => {
      compressedSchema[table] = schema[table].map((column: any) => {
        return `${column.name} (${column.type})`; // Format: "column_name (type)"
      });
    });

    return JSON.stringify(compressedSchema);
  }

  extractSQL(responseText) {
    // Match SQL code inside ```sql ... ```
    const sql = this.extractCode(responseText, 'sql');

    if (sql) return sql;

    // If no code block is found, try extracting the last SELECT statement
    const selectMatch = responseText.match(/SELECT\s+[\s\S]*?;/i);
    if (selectMatch) {
      return selectMatch[0].trim();
    }

    return ''; // Return empty string if no SQL is found
  }

  async sendRequest(prompt: string, max_tokens = 200) {
    console.log('#######prompt', prompt);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: max_tokens,
    });

    const responseContent = response.choices[0]?.message?.content?.trim();

    console.log('########Response', responseContent);

    return responseContent;
  }

  extractCode(content: string, language?: string): string {
    const regex = language
      ? new RegExp(`\`\`\`${language}\\s*([\\s\\S]*?)\`\`\``, 'i')
      : /```(?:\w+)?\s*([\s\S]*?)```/;

    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }
}
