export declare const swcDefaultsFactory: () => {
    swcOptions: {
        module: {
            type: string;
        };
        jsc: {
            target: string;
            parser: {
                syntax: string;
                decorators: boolean;
                dynamicImport: boolean;
            };
            transform: {
                legacyDecorator: boolean;
                decoratorMetadata: boolean;
            };
            keepClassNames: boolean;
            baseUrl: string;
        };
        minify: boolean;
        swcrc: boolean;
    };
    cliOptions: {
        outDir: string;
        filenames: string[];
        sync: boolean;
        extensions: string[];
        watch: boolean;
        copyFiles: boolean;
        includeDotfiles: boolean;
        quiet: boolean;
    };
};
