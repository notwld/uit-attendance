
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json,os


def login(username, password):
    """Login to the ERP portal and fetch the attendance page

    Args:
        username (str): Username
        password (str): Password

    Returns:
        str: HTML of the attendance page
    """
    req = requests.Session()
    payload = json.load(open(os.path.join(os.path.dirname(__file__), 'payload.json')))

    url = 'http://erp.uit.edu:803/StudentPortal/Student/EDU_EBS_STU_Login.aspx'

    payload['ctl00$ContentPlaceHolder1$txtRegistrationNo_cs'] = username
    payload['ctl00$ContentPlaceHolder1$txtPassword_m6cs'] = password
    payload['ctl00$ContentPlaceHolder1$btnlgn'] = 'Login'

    req.post(url, data=payload)
    res = req.get(
        'http://erp.uit.edu:803/StudentPortal/Student/EDU_EBS_STU_Dashboard.aspx')
    res = req.get(
        'http://erp.uit.edu:803/StudentPortal/Student/EDU_EBS_STU_Attendance.aspx')
    return res.text


def fetch_attendance(username, password):
    """Fetch the attendance of the user

    Args:
        username (str): Username (eg. 2018-EE-000)
        password (str): Password

    Returns:
       dict: Attendance of the user
    """

    soup = BeautifulSoup(login(username, password), 'html.parser')
    name = soup.find('span', attrs={'id': 'ctl00_user_name'})
    print(name.text)
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

        return attendance, name.text
    return None


app = Flask(__name__)
CORS(app)


@app.route('/fetchAttendance', methods=['POST'])
def fetch():
    if request.method == 'POST':
        credentials = request.get_json()
        username = credentials['username']
        password = credentials['password']

        user_login = fetch_attendance(username, password)[0]
        return jsonify({"data": user_login, "name": fetch_attendance(username, password)[1]})

        # return jsonify({"error": "Invalid Credentials"})
    return jsonify({"error": "Invalid Request"})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
