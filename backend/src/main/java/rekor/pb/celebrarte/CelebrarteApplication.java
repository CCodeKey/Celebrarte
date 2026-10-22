package rekor.pb.celebrarte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import rekor.pb.celebrarte.config.DotEnvConfig;

@SpringBootApplication
public class CelebrarteApplication {

	public static void main(String[] args) {
		DotEnvConfig.load();

		SpringApplication.run(CelebrarteApplication.class, args);
	}

}
