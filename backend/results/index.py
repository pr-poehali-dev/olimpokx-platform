"""
API для сохранения и получения результатов экзаменов и тренажёров.
GET /?type=exam  — история экзаменов
GET /?type=trainer — история тренажёров
POST / с body {type: "exam", ...} — сохранить результат экзамена
POST / с body {type: "trainer", ...} — сохранить результат тренажёра
"""
import json
import os
import psycopg2


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    user_id = event.get("headers", {}).get("X-User-Id", "default")
    params = event.get("queryStringParameters") or {}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        kind = body.get("type", "")

        if kind == "exam":
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                """
                INSERT INTO exam_results
                  (user_id, exam_id, exam_title, score, correct_count, total_questions,
                   time_spent, passed, answers)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, created_at
                """,
                (
                    user_id,
                    body["exam_id"],
                    body["exam_title"],
                    body["score"],
                    body["correct_count"],
                    body["total_questions"],
                    body["time_spent"],
                    body["passed"],
                    json.dumps(body.get("answers", {})),
                ),
            )
            row = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({"ok": True, "id": row[0], "created_at": str(row[1])}),
            }

        if kind == "trainer":
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                """
                INSERT INTO trainer_results
                  (user_id, trainer_id, trainer_title, score, correct_count, total_steps, time_spent)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, created_at
                """,
                (
                    user_id,
                    body["trainer_id"],
                    body["trainer_title"],
                    body["score"],
                    body["correct_count"],
                    body["total_steps"],
                    body["time_spent"],
                ),
            )
            row = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({"ok": True, "id": row[0], "created_at": str(row[1])}),
            }

        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "type required: exam or trainer"}),
        }

    if method == "GET":
        kind = params.get("type", "")

        if kind == "exam":
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT id, exam_id, exam_title, score, correct_count, total_questions,
                       time_spent, passed, created_at
                FROM exam_results
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 50
                """,
                (user_id,),
            )
            rows = cur.fetchall()
            cur.close()
            conn.close()
            results = [
                {
                    "id": r[0], "exam_id": r[1], "exam_title": r[2],
                    "score": r[3], "correct_count": r[4], "total_questions": r[5],
                    "time_spent": r[6], "passed": r[7], "created_at": str(r[8]),
                }
                for r in rows
            ]
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({"results": results}),
            }

        if kind == "trainer":
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT id, trainer_id, trainer_title, score, correct_count, total_steps,
                       time_spent, created_at
                FROM trainer_results
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 50
                """,
                (user_id,),
            )
            rows = cur.fetchall()
            cur.close()
            conn.close()
            results = [
                {
                    "id": r[0], "trainer_id": r[1], "trainer_title": r[2],
                    "score": r[3], "correct_count": r[4], "total_steps": r[5],
                    "time_spent": r[6], "created_at": str(r[7]),
                }
                for r in rows
            ]
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({"results": results}),
            }

        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "type required: exam or trainer"}),
        }

    return {
        "statusCode": 405,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": "Method not allowed"}),
    }
