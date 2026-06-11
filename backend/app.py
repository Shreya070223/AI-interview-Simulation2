from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
from transformers import pipeline
from pypdf import PdfReader
from dotenv import load_dotenv
import os

load_dotenv()

app=FastAPI()

gemini=genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

summarizer=pipeline("summarization",model="facebook/bart-large-cnn")
skill_extract=pipeline(
    "token-classification",
    model="dslim/bert-base-NER"
)

skills_db = [
    "Python",
    "Java",
    "React",
    "FastAPI",
    "TensorFlow",
    "Docker",
    ...
]

def generatingResumeInfo(text):
  text+='''   Extract project names and technologies from this resume text and
       Return JSON.'''
  projects= gemini.model.generte_content(
    model="gemini-2.5-flash",
    contents=text
  )
  skills='abc'
  summary='abd'
  return {
    "skills":skills,
    "summary":summary,
    "projects":projects
  }
  

@app.post("/uploadResume")
def upload(pdf):
  reader=PdfReader(pdf)
  text = ""
  for page in reader.pages:
    text += page.extract_text()
  res=generatingResumeInfo(text)
  return {
    "summary":res.summary,
    "skills":res.skills,
    "projects":res.projects
  }
  
  


