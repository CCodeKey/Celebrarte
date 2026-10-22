# Etapa 1: compila o jar com o Maven Wrapper
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Dependências primeiro: ficam em cache enquanto o pom.xml não mudar
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw -q dependency:go-offline

COPY src src
# Os testes precisam de banco; rodam fora do build da imagem
RUN ./mvnw -q package -DskipTests && cp target/*.jar app.jar

# Etapa 2: só o JRE e o jar
FROM eclipse-temurin:21-jre
WORKDIR /app

RUN groupadd --system app && useradd --system --gid app app
USER app

COPY --from=build /app/app.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
