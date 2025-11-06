import sys
from pdf2docx import Converter
import os

def convert(pdf_file, docx_file):
    cv = Converter(pdf_file)
    cv.convert(docx_file, start=0, end=None)
    cv.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("ERROR: Usage: convert.py <pdf_file> <docx_file>")
        sys.exit(1)
    pdf_file = sys.argv[1]
    docx_file = sys.argv[2]
    try:
        convert(pdf_file, docx_file)
        print(os.path.abspath(docx_file))  # <-- always print absolute final path
    except Exception as e:
        print("ERROR:", e)
        sys.exit(1)
