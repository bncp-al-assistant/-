import streamlit as st
import fitz
from openai import OpenAI

# OpenAI API
client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"]
)

# PDF 읽기
pdf_path = "메뉴판.pdf"

doc = fitz.open(pdf_path)

pdf_text = ""

for page in doc:
    pdf_text += page.get_text()

st.title("🍽 BNCP AI 비서")

question = st.text_input("질문을 입력하세요.")

if st.button("질문하기"):

    response = client.responses.create(
        model="gpt-5.5",
        input=f"""
당신은 BNCP AI입니다.

다음은 PDF 내용입니다.

{pdf_text}

사용자 질문

{question}

PDF 내용만 참고하여 답변하세요.
없으면

'PDF에서 확인되지 않습니다.'

라고 답하세요.
"""
    )

    st.write(response.output_text)