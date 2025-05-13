import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:5001/graphql",
  documents: "src/**/*.tsx",
  generates: {
    "src/__generated__/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;
