from pytubefix import YouTube
import sys
import os
import time

def download_video(url, output_dir, retries=3):
    attempt = 0
    while attempt < retries:
        try:
            yt = YouTube(url)
            stream = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
            if not stream:
                print("No suitable video stream found.")
                return None
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            file_path = stream.download(output_path=output_dir)
            print(f"Download succeeded: {os.path.abspath(file_path)}")
            return os.path.abspath(file_path)
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            attempt += 1
            time.sleep(2)  # brief pause before retry
    print("Download failed after multiple attempts.")
    return None

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: yt_download.py <youtube_url> <output_dir>")
        sys.exit(1)
    download_video(sys.argv[1], sys.argv[2])
