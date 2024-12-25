# Secure Todo Application with CI/CD Pipeline

A Todo List application demonstrating CI/CD implementation with security scanning integration. This project showcases the implementation of Jenkins pipeline with various security tools and automated deployment workflows.

## Key Features

- **Basic Todo Operations**
  - Create, Read, Update, Delete todos
  - Simple and intuitive interface
- **Docker Containerization**
- **Security Scanning Integration**
  - OWASP Dependency Check
  - Trivy Container Scanning
  - SonarQube Code Analysis
- **Automated CI/CD Pipeline**
- **Docker Hub Integration**

## Technology Stack

- **Backend**: Python Flask
- **Database**: SQLite
- **Frontend**: HTML, CSS, JavaScript
- **Containerization**: Docker & Docker Compose
- **CI/CD**: Jenkins Pipeline
- **Security Tools**:
  - SonarQube
  - Trivy
  - OWASP Dependency Check
- **Version Control**: Git

## Security Tools Overview

### 1. SonarQube
- Code quality analysis
- Code smell detection
- Security vulnerability scanning
- Code coverage tracking

### 2. Trivy
- Container vulnerability scanning
- Dependency vulnerability detection
- Security issue reporting

### 3. OWASP Dependency Check
- Third-party dependency scanning
- Known vulnerability detection
- Security reporting

## Setup Guide

### Prerequisites Installation

1. **Jenkins Installation**:
   ```bash
   # For Ubuntu/Debian
   wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
   sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
   sudo apt update
   sudo apt install jenkins
   ```

2. **SonarQube Setup**:
   ```bash
   docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
   ```

3. **Trivy Installation**:
   ```bash
   sudo apt-get install wget apt-transport-https gnupg lsb-release
   wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
   echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
   sudo apt-get update
   sudo apt-get install trivy
   ```

### Jenkins Configuration

1. **Required Plugins**:
   - Docker Pipeline
   - SonarQube Scanner
   - OWASP Dependency-Check
   - Pipeline Utility Steps
   - Credentials Binding

2. **Tool Configuration**:

   a. **SonarQube Setup**:
   - Go to `Manage Jenkins` > `Configure System`
   - Find `SonarQube servers`
   - Add SonarQube:
     - Name: `SonarQube`
     - Server URL: `http://localhost:9000`
     - Add credentials for token

   b. **OWASP Dependency-Check**:
   - Go to `Manage Jenkins` > `Global Tool Configuration`
   - Add Dependency-Check:
     - Name: `OWASP`
     - Install automatically: Check

3. **Credentials Setup**:
   - Go to `Manage Jenkins` > `Manage Credentials`
   - Add credentials:
     ```
     Docker Hub:
     - Kind: Username with password
     - ID: dhc
     - Description: Docker Hub Credentials
     
     SonarQube:
     - Kind: Secret text
     - ID: sqt
     - Description: SonarQube Token
     ```

### SonarQube Configuration

1. **Token Generation**:
   - Login to SonarQube
   - Go to User > My Account > Security
   - Generate token
   - Save token in Jenkins credentials

2. **Webhook Setup**:
   - Go to Project Settings > Webhooks
   - Create webhook:
     - Name: Jenkins
     - URL: http://jenkins-url/sonarqube-webhook/

## Pipeline Workflow

1. **Code Checkout**
   - Clone from GitHub repository

2. **Security Scans**
   - OWASP Dependency Check
   - SonarQube Analysis
   - Quality Gate verification
   - Trivy Container Scan

3. **Build & Deploy**
   - Docker image build
   - Push to Docker Hub
   - Deploy with Docker Compose

## Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/Harshil-kumar-4/jenkins-project.git
   cd jenkins-project
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access at: `http://localhost:4000`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Author

Created by Harshil Kumar as a demonstration of implementing CI/CD pipeline with security scanning integration. This project showcases practical implementation of DevOps tools and security practices.
