export type ArticleType = {
  id: string;                        // ✅ fine
  name: string;                      // ✅ fine
  description: string;               // ✅ fine
  imgs: Array<string>;               // ❌ was Array(string) → correct is Array<string> or string[]
  price: number;                     // ✅ fine
  is_available: boolean;             // ✅ fine
  short_name: string;                // ❌ should be lowercase string, not String (String is the JS object wrapper)
  options: Record<string, any>;
  options_options:  Record<string, any>;     // ❌ JSON is not a TS type → use Record<string, any> or unknown
  created_at: string | null; 
  is_good: boolean;
  categorie: string | null       // ✅ fine
};
