import logging
import os
from flask import Flask, Response, request, jsonify, make_response
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId

load_dotenv()

app = Flask(__name__)
mongo_url = os.environ.get("MONGODB_URL")
print(mongo_url)

client = MongoClient(mongo_url)
db = client['test']

@app.get("/api/sensors/<sensor_id>")
def get_sensors(sensor_id):
    filter = {} if sensor_id is None else {"sensor_id": sensor_id}
    sensors = list(db.sensors.find(filter))

    response = Response(
        response=dumps(sensors), status=200,  mimetype="application/json")
    return response


@app.get("/api/items/<item_claim>")
def get_items(item_claim):
    filter = {} if item_claim is None else {"item_claim": item_claim}
    items = list(db.items.find(filter))

    response = Response(
        response=dumps(items), status=200,  mimetype="application/json")
    return response

@app.put("/api/sensors/<sensor_id>")
def update_sensor(sensor_id):
    _json = request.json
    logging.info(f"Received data for sensor_id {sensor_id}: {_json}")

    # Update the document where 'sensor_id' matches
    result = db.sensors.update_one({'sensor_id': sensor_id}, {"$set": _json})

    if result.matched_count == 0:
        return jsonify({"message": "Sensor not found"}), 404

    resp = jsonify({"message": "Sensor updated successfully"})
    resp.status_code = 200
    return resp

@app.put("/api/items/<item_claim>")
def update_item(item_claim):
    _json = request.json
    # Update the document where 'item_claim' matches
    db.items.update_one({'item_claim': item_claim}, {"$set": _json})

    resp = jsonify({"message": "Sensor updated successfully"})
    resp.status_code = 200
    return resp

@app.errorhandler(400)
def handle_400_error(error):
    return make_response(jsonify({"errorCode": error.code, 
                                  "errorDescription": "Bad request!",
                                  "errorDetailedDescription": error.description,
                                  "errorName": error.name}), 400)

@app.errorhandler(404)
def handle_404_error(error):
        return make_response(jsonify({"errorCode": error.code, 
                                  "errorDescription": "Resource not found!",
                                  "errorDetailedDescription": error.description,
                                  "errorName": error.name}), 404)

@app.errorhandler(500)
def handle_500_error(error):
        return make_response(jsonify({"errorCode": error.code, 
                                  "errorDescription": "Internal Server Error",
                                  "errorDetailedDescription": error.description,
                                  "errorName": error.name}), 500)

app.run(host="0.0.0.0", port=5000, debug=True)
