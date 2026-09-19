pipeline {

    agent any

    environment {
        IMAGE = 'viswapriya/lab12-node-api:latest'
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE% .'
            }
        }

        stage('Push Docker Image') {
            steps {
                bat 'docker push %IMAGE%'
            }
        }

        stage('Deploy Green') {
            steps {
                bat '''
                docker rm -f green 2>NUL || exit /b 0
                docker run -d --name green --network bluegreen-net -p 3002:3000 -e VERSION=green %IMAGE%
                '''
            }
        }

        stage('Test Green') {
            steps {
                bat '''
                powershell -Command "$response = Invoke-RestMethod http://localhost:3002/status; if ($response.status -ne 'UP') { exit 1 }; if ($response.version -ne 'green') { exit 1 }; Write-Host 'Green environment is healthy'"
                '''
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                bat '''
                powershell -Command "(Get-Content nginx\\nginx.conf) -replace 'server blue:3000;', 'server green:3000;' | Set-Content nginx\\nginx-green.conf"
                docker cp nginx\\nginx-green.conf nginx-proxy:/etc/nginx/nginx.conf
                docker exec nginx-proxy nginx -t
                docker exec nginx-proxy nginx -s reload
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                bat '''
                powershell -Command "$response = Invoke-RestMethod http://localhost:8080/status; Write-Host ('Proxy response: ' + $response.version); if ($response.status -ne 'UP') { exit 1 }; if ($response.version -ne 'green') { exit 1 }"
                '''
            }
        }
    }
}