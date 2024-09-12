import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(subject, body, to_email):
    # Sender email credentials
    sender_email = "rvignesh565@gmail.com"
    sender_password = "bdgqtgttquthprvg"

    # Create the MIME object
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject

    # Attach the body of the email
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Secure the connection
        server.login(sender_email, sender_password)

        # Send the email
        server.send_message(msg)

        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")
    finally:
        server.quit()

# Usage
send_email(
    subject="Test Email",
    body="Hello! This is a test email sent from Python. balhkjsdbsakjd ksd asdb",
    to_email="dhanaredback@gmail.com"
)
