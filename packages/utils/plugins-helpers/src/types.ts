import { GraphQLSchema, DocumentNode } from 'graphql';

export namespace Types {
  export type FileOutput = {
    filename: string;
    content: string;
  };

  export type DocumentFile = {
    filePath: string;
    content: DocumentNode;
  };

  /* Utils */
  export type InstanceOrArray<T> = T | T[];

  /* Schema Definition */
  export type SchemaWithLoader = { [schemaString: string]: { loader: string } };
  export type UrlSchema = string | { [url: string]: { headers?: { [headerName: string]: string } } };
  export type LocalSchemaPath = string;
  export type SchemaGlobPath = string;
  export type Schema = UrlSchema | LocalSchemaPath | SchemaGlobPath | SchemaWithLoader;

  /* Document Definitions */
  export type OperationDocumentGlobPath = string;
  export type CustomDocumentLoader = { [path: string]: { loader: string } };
  export type OperationDocument = OperationDocumentGlobPath | CustomDocumentLoader;

  /* Plugin Definition */
  export type PluginConfig = InstanceOrArray<string> | { [key: string]: any };
  export type ConfiguredPlugin = { [name: string]: PluginConfig };
  export type NamedPlugin = string;

  /* Output Definition */
  export type OutputConfig = InstanceOrArray<NamedPlugin | ConfiguredPlugin>;
  export type ConfiguredOutput = {
    overwrite?: boolean;
    documents?: InstanceOrArray<OperationDocument>;
    schema?: InstanceOrArray<Schema>;
    plugins: OutputConfig;
    config?: { [key: string]: any };
  };

  /* Require Extensions */
  export type RequireExtension = InstanceOrArray<string>;

  /* Plugin Loader */
  export type PluginLoaderFn = (pluginName: string) => CodegenPlugin | Promise<CodegenPlugin>;

  /* Config Definition */
  export interface Config {
    schema?: InstanceOrArray<Schema>;
    require?: RequireExtension;
    documents?: InstanceOrArray<OperationDocument>;
    config?: { [key: string]: any };
    generates: { [filename: string]: OutputConfig | ConfiguredOutput };
    overwrite?: boolean;
    watch?: boolean | string | string[];
    silent?: boolean;
    pluginLoader?: PluginLoaderFn;
    pluckConfig?: {
      modules?: Array<{
        name: string;
        identifier?: string;
      }>;
      magicComment?: string;
      globalIdentifier?: string;
    };
  }
}

export type PluginFunction<T = any> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: T,
  info?: {
    outputFile?: string;
    allPlugins?: Types.ConfiguredPlugin[];
    [key: string]: any;
  }
) => Promise<string> | string;

export type PluginValidateFn<T = any> = (schema: GraphQLSchema, documents: Types.DocumentFile[], config: T, outputFile: string, allPlugins: Types.ConfiguredPlugin[]) => Promise<void> | void;

export interface CodegenPlugin<T = any> {
  plugin: PluginFunction<T>;
  addToSchema?: string | DocumentNode;
  validate?: PluginValidateFn;
}
