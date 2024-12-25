FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install pytest pytest-cov

COPY . .

# Run tests
RUN python -m pytest --cov=. --cov-report=xml

EXPOSE 4000

CMD ["python", "app.py"]
