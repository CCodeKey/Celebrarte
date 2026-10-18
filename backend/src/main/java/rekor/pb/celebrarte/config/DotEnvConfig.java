package rekor.pb.celebrarte.config;

import io.github.cdimascio.dotenv.Dotenv;

public class DotEnvConfig {

    public static void load() {
        Dotenv dotenv = Dotenv.load();

        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
    }
}