export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Posts tables
      posts: {
        Row: {
          id: number;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          featured_image: string | null;
          author_id: number | null;
          tags: string[] | null;
          reading_time: number;
          published_at: string;
          updated_at: string;
          status: string;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          author_id?: number | null;
          tags?: string[] | null;
          reading_time?: number;
          published_at?: string;
          updated_at?: string;
          status?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          author_id?: number | null;
          tags?: string[] | null;
          reading_time?: number;
          published_at?: string;
          updated_at?: string;
          status?: string;
          seo_title?: string | null;
          seo_description?: string | null;
        };
      };
      post_categories: {
        Row: {
          id: number;
          slug: string;
          name: string;
          parent_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          parent_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
          parent_id?: number | null;
        };
      };
      posts_categories: {
        Row: {
          post_id: number;
          category_id: number;
        };
        Insert: {
          post_id: number;
          category_id: number;
        };
        Update: {
          post_id?: number;
          category_id?: number;
        };
      };
      authors: {
        Row: {
          id: number;
          slug: string;
          name: string;
          avatar: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          avatar?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
          avatar?: string | null;
          bio?: string | null;
        };
      };
      // Recipes tables
      recipes: {
        Row: {
          id: number;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          featured_image: string | null;
          images: string[] | null;
          introduction: string | null;
          conclusion: string | null;
          video_url: string | null;
          faq: string | null;
          prep_time: number;
          cook_time: number;
          rest_time: number | null;
          total_time: number;
          servings: number;
          servings_unit: string | null;
          difficulty: 'facile' | 'moyen' | 'difficile';
          ingredients: Json;
          instructions: Json;
          nutrition: Json | null;
          tags: string[] | null;
          cuisine: string | null;
          author: string;
          published_at: string;
          updated_at: string;
          likes: number;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          images?: string[] | null;
          introduction?: string | null;
          conclusion?: string | null;
          video_url?: string | null;
          faq?: string | null;
          prep_time: number;
          cook_time: number;
          rest_time?: number | null;
          total_time: number;
          servings: number;
          servings_unit?: string | null;
          difficulty: 'facile' | 'moyen' | 'difficile';
          ingredients: Json;
          instructions: Json;
          nutrition?: Json | null;
          tags?: string[] | null;
          cuisine?: string | null;
          author: string;
          published_at: string;
          updated_at?: string;
          likes?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          images?: string[] | null;
          introduction?: string | null;
          conclusion?: string | null;
          video_url?: string | null;
          faq?: string | null;
          prep_time?: number;
          cook_time?: number;
          rest_time?: number | null;
          total_time?: number;
          servings?: number;
          servings_unit?: string | null;
          difficulty?: 'facile' | 'moyen' | 'difficile';
          ingredients?: Json;
          instructions?: Json;
          nutrition?: Json | null;
          tags?: string[] | null;
          cuisine?: string | null;
          author?: string;
          published_at?: string;
          updated_at?: string;
          likes?: number;
          seo_title?: string | null;
          seo_description?: string | null;
        };
      };
      // Taxonomies tables
      ingredients: {
        Row: {
          id: number;
          slug: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
        };
      };
      origines: {
        Row: {
          id: number;
          slug: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
        };
      };
      cuisine_types: {
        Row: {
          id: number;
          slug: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
        };
      };
      recipe_ingredients: {
        Row: {
          recipe_id: number;
          ingredient_id: number;
        };
        Insert: {
          recipe_id: number;
          ingredient_id: number;
        };
        Update: {
          recipe_id?: number;
          ingredient_id?: number;
        };
      };
      recipe_origines: {
        Row: {
          recipe_id: number;
          origine_id: number;
        };
        Insert: {
          recipe_id: number;
          origine_id: number;
        };
        Update: {
          recipe_id?: number;
          origine_id?: number;
        };
      };
      recipe_cuisine_types: {
        Row: {
          recipe_id: number;
          cuisine_type_id: number;
        };
        Insert: {
          recipe_id: number;
          cuisine_type_id: number;
        };
        Update: {
          recipe_id?: number;
          cuisine_type_id?: number;
        };
      };
      categories: {
        Row: {
          id: number;
          slug: string;
          name: string;
          parent_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          parent_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
          parent_id?: number | null;
        };
      };
      recipe_categories: {
        Row: {
          recipe_id: number;
          category_id: number;
        };
        Insert: {
          recipe_id: number;
          category_id: number;
        };
        Update: {
          recipe_id?: number;
          category_id?: number;
        };
      };
      // View treated as table for Supabase client compatibility
      posts_with_details: {
        Row: {
          id: number;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          featured_image: string | null;
          author: Json | null;
          categories: Json | null;
          tags: string[] | null;
          reading_time: number;
          published_at: string;
          updated_at: string;
          status: string;
          seo_title: string | null;
          seo_description: string | null;
        };
        Insert: never;
        Update: never;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      difficulty_level: 'facile' | 'moyen' | 'difficile';
    };
  };
}
