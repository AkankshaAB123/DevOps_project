pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/AkankshaAB123/DevOps_project.git'
            }
        }

        stage('Build') {
            steps {
                sh 'cd backend && npm install'
                sh 'cd frontend && npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'No tests yet — pipeline working'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up --build -d'
            }
        }
    }
}