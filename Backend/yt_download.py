from pytubefix import YouTube
import sys
import os

if len(sys.argv) != 3:
    print("Usage: yt_download.py <youtube_url> <output_dir>")
    sys.exit(1)

url = sys.argv[1]
output_dir = sys.argv[2]

try:
    yt = YouTube(url)
    print(f"Video title: {yt.title}")

    # List all available progressive MP4 streams for debugging
    streams = yt.streams.filter(progressive=True, file_extension='mp4')
    if not streams:
        print("ERROR: No suitable mp4 streams found.")
        sys.exit(1)
    for s in streams:
        print(f"Available stream: {s.resolution}, itag: {s.itag}")

    stream = streams.order_by('resolution').desc().first()
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    file_path = stream.download(output_path=output_dir)
    print(f"Downloaded to: {os.path.abspath(file_path)}")
except Exception as e:
    print("ERROR:", str(e))
    sys.exit(1)
