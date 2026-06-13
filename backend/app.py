from fastapi import FastAPI, UploadFile, File
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

skills_db = [
    "Python",
    "Java",
    "React",
    "FastAPI",
    "TensorFlow",
    "Docker"
]

def chunk_text(text, chunk_size=800):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def Summar(text):
  chunks = chunk_text(text)
  summaries = []
  for chunk in chunks:
    result = summarizer(chunk)
    summaries.append(result[0]["summary_text"])
  final_summary = " ".join(summaries)
  return final_summary

def skill(text):
  found_skills = []
  for skill in skills_db:
    if skill.lower() in text.lower():
        found_skills.append(skill)
  return found_skills


def generatingResumeInfo(text):
  summary=Summar(text)
  skills=skill(text)
  text+='''   Extract project names and technologies from this resume text and
       Return JSON.'''
  # projects= gemini.model.generte_content(
  #   model="gemini-2.5-flash",
  #   contents=text
  # )
  projects={"project1":"cropcare"}
  return {
    "skills":skills,
    "summary":summary,
    "projects":projects
  }
  

@app.post("/uploadResume")
def upload(file: UploadFile = File(...)):
  reader=PdfReader(file.file)
  text = ""
  for page in reader.pages:
    text += page.extract_text()
  res=generatingResumeInfo(text)
  return {
    "summary": res["summary"],
    "skills": res["skills"],
    "projects": res["projects"]
  }

@app.get("/generateQue")
def QGeneration():
  pass
  


