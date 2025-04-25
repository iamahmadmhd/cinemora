export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                    extensions?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    public: {
        Tables: {
            list_items: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    movie_id: string;
                    id: string;
                    image_url: string | null;
                    list_id: string | null;
                    metadata: Json | null;
                    title: string;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    movie_id: string;
                    id?: string;
                    image_url?: string | null;
                    list_id?: string | null;
                    metadata?: Json | null;
                    title: string;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    movie_id?: string;
                    id?: string;
                    image_url?: string | null;
                    list_id?: string | null;
                    metadata?: Json | null;
                    title?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'list_items_list_id_fkey';
                        columns: ['list_id'];
                        isOneToOne: false;
                        referencedRelation: 'watchlists';
                        referencedColumns: ['id'];
                    },
                ];
            };
            profiles: {
                Row: {
                    avatar: string | null;
                    birthdate: string | null;
                    created_at: string | null;
                    email: string | null;
                    firstname: string;
                    id: string;
                    lastname: string;
                    user_id: string;
                    watchlist: string | null;
                };
                Insert: {
                    avatar?: string | null;
                    birthdate?: string | null;
                    created_at?: string | null;
                    email?: string | null;
                    firstname: string;
                    id?: string;
                    lastname: string;
                    user_id: string;
                    watchlist?: string | null;
                };
                Update: {
                    avatar?: string | null;
                    birthdate?: string | null;
                    created_at?: string | null;
                    email?: string | null;
                    firstname?: string;
                    id?: string;
                    lastname?: string;
                    user_id?: string;
                    watchlist?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'profiles_watchlist_fkey';
                        columns: ['watchlist'];
                        isOneToOne: false;
                        referencedRelation: 'watchlists';
                        referencedColumns: ['id'];
                    },
                ];
            };
            watchlists: {
                Row: {
                    allowed_users: string[] | null;
                    created_at: string | null;
                    id: string;
                    is_public: boolean | null;
                    items: string[] | null;
                    user_id: string | null;
                };
                Insert: {
                    allowed_users?: string[] | null;
                    created_at?: string | null;
                    id?: string;
                    is_public?: boolean | null;
                    items?: string[] | null;
                    user_id?: string | null;
                };
                Update: {
                    allowed_users?: string[] | null;
                    created_at?: string | null;
                    id?: string;
                    is_public?: boolean | null;
                    items?: string[] | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'watchlists_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'profiles';
                        referencedColumns: ['user_id'];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
              Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
          Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
            DefaultSchema['Views'])
      ? (DefaultSchema['Tables'] &
            DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema['Enums']
        | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
      ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema['CompositeTypes']
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
      ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
      : never;

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {},
    },
} as const;
