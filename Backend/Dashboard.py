import pandas as pd
import json
import cv2

#url = "https://192.168.31.47:8080/video"


#cap = cv2.VideoCapture(url)
image = cv2.imread("testing_3.jpg")
detector = cv2.QRCodeDetector()
data, points, _ = detector.detectAndDecode(image)

#while True:
    #ret, frame = cap.read()

    #if not ret:
        #print("Camera connection failed")
        #break

    #data, points, _ = detector.detectAndDecode(frame)

    #if data:
        #print("QR Code:", data)

    #cv2.imshow("QR Scanner", frame)

    #if cv2.waitKey(1) & 0xFF == ord('q'):
        #break
        
        

#cap.release()
#cv2.destroyAllWindows()

records = json.loads(data)
print(records)

df = pd.DataFrame(records)
print(df)





