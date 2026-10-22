package rekor.pb.celebrarte.config;

import io.github.cdimascio.dotenv.Dotenv;

public class DotEnvConfig {

    public static void load() {
        // No Docker não há .env: as variáveis chegam pelo ambiente do container
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
    }
}