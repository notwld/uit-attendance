
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json

def login(username, password):
    req = requests.Session()
    payload = json.load(open('payload.json'))

    url = 'http://erp.uit.edu:803/StudentPortal/Student/EDU_EBS_STU_Login.aspx'

    payload['ctl00$ContentPlaceHolder1$txtRegistrationNo_cs'] = username
    payload['ctl00$ContentPlaceHolder1$txtPassword_m6cs'] = password
    payload['ctl00$ContentPlaceHolder1$btnlgn']= 'Login'
    
    req.post(url, data=payload)
    res = req.get('http://erp.uit.edu:803/StudentPortal/Student/EDU_EBS_STU_Dashboard.aspx')
    res = req.get('http://erp.uit.edu:803/StudentPortal/Student/EDU_EBS_STU_Attendance.aspx')
    return res.text

def fetch_attendance(username, password):
    soup = BeautifulSoup(login(username, password), 'html.parser')
    table = "rgMasterTable"

    table = soup.find('table', attrs={'class': table})
    if table is not None:
        table_body = table.find('tbody')

        rows = table_body.find_all('tr')
        data = []
        for row in rows:
            cols = row.find_all('td')
            cols = [ele.text.strip() for ele in cols]
            data.append([ele for ele in cols if ele])

        attendance = {
            "CourseCode": [],
            "TotalClasses": [],
            "ClassesTaken": [],
            "ClassesAttended": [],
            "AttendancePercentage": []
        }

        for i in range(len(data)):
            attendance["CourseCode"].append(data[i][0])
            attendance["TotalClasses"].append(data[i][2])
            attendance["ClassesTaken"].append(data[i][3])
            attendance["ClassesAttended"].append(data[i][4])
            attendance["AttendancePercentage"].append(data[i][5])

        return attendance
    return None

app = Flask(__name__)
CORS(app)

@app.route('/fetchAttendance', methods=['POST'])
def fetchAttendance():
    if request.method == 'POST':
        credentials = request.get_json()
        username = credentials['username']
        password = credentials['password']

        user_login = fetch_attendance(username, password)
        if user_login is not None:
            return jsonify(user_login)
        
        return jsonify({"error": "Invalid Credentials"})
    return jsonify({"error": "Invalid Request"})
        

if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port=5000)