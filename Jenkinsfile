pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'todo-app'
        DOCKER_TAG = 'latest'
    }
    
    stages {
        stage("Code") {
            steps {
                git url: "https://github.com/Harshil-kumar-4/jenkins-project.git", branch: "master"
                echo "Code cloning successful"
            }
        }
        
        stage("OWASP Dependency Check") {
            steps {
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'OWASP'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        
        stage("SonarQube Analysis") {
            steps {
                withCredentials([string(credentialsId: 'sqt', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        sonar-scanner \
                        -Dsonar.host.url=http://localhost:9000 \
                        -Dsonar.login=$SONAR_TOKEN \
                        -Dsonar.projectKey=todo-app \
                        -Dsonar.sources=. \
                        -Dsonar.python.coverage.reportPaths=coverage.xml
                    '''
                }
            }
        }
        
        stage("SonarQube Quality Gate") {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage("Build") {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                echo "Build successful"
            }
        }
        
        stage("Trivy Security Scan") {
            steps {
                sh "trivy image ${DOCKER_IMAGE}:${DOCKER_TAG} > trivy-report.txt"
                sh "cat trivy-report.txt"
            }
        }
        
        stage("Push to DockerHub") {
            steps {
                withCredentials([usernamePassword(credentialsId:"dhc", passwordVariable:"dockerPass", usernameVariable:"dockerUser")]) {
                    sh "docker login -u ${env.dockerUser} -p ${env.dockerPass}"
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${env.dockerUser}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "docker push ${env.dockerUser}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
                echo "Push successful"
            }
        }
        
        stage("Deploy") {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
                echo "Deployment successful"
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
            // Archive security reports
            archiveArtifacts artifacts: '**/dependency-check-report.xml,**/trivy-report.txt', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
