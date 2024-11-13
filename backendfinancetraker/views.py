from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserModel, EntrieModel, user_collection, entrie_collection
from bson import ObjectId
from datetime import datetime
import json
import base64

@csrf_exempt
def user_register(request):
    if request.method == "POST":
        try:
            user_name = request.POST.get("username")
            user_email = request.POST.get("email")
            user_password = request.POST.get("password")
            image_file = request.FILES.get("profileimage")

            if not all([user_name, user_email, user_password]):
                return JsonResponse({"error": "Required fields missing"}, status=400)

            if user_collection.find_one({"username": user_name}):
                return JsonResponse({"error": "Username taken"}, status=409)

            image_data = base64.b64encode(image_file.read()).decode('utf-8') if image_file else None
            new_user = UserModel(user_name, user_email, user_password, image_data)
            user_collection.insert_one(new_user.__dict__)

            return JsonResponse({
                "message": "Account successfully created",
                "user_info": {
                    "username": new_user.username,
                    "email": new_user.email,
                    "profile_image" : image_data,
                    "registered_on": new_user.created_at,
                    "last_updated": new_user.updated_at,
                }
            }, status=201)
        except Exception as err:
            return JsonResponse({"error": str(err)}, status=500)

    return HttpResponse("Method not allowed", status=405)


@csrf_exempt
def user_login(request):
    if request.method == "POST":
        try:
           
            email = request.POST.get("email")
            password = request.POST.get("password")

           
            if not email or not password:
                return JsonResponse({"error": "Both email and password are required"}, status=400)

           
            user_data = user_collection.find_one({"email": email})

           
            if not user_data:
                return JsonResponse({"error": "Invalid email"}, status=401)
            
            if user_data["password"] != password:
                return JsonResponse({"error": "Invalid password"}, status=401)

           
            response_data = {
                "message": "Login successful",
                "user": {
                    "id": str(user_data["_id"]), 
                    "email": user_data["email"],
                    "username": user_data["username"]
                }
            }
            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return HttpResponse("Invalid request method", status=405)



def get_user(request, userId):
    if request.method == "GET":
        try:
            user_id = ObjectId(userId)
            user = user_collection.find_one({"_id": user_id})
            if user:
                if isinstance(user.get("profileimage"), bytes):
                    image_data = base64.b64encode(user["profileimage"]).decode(
                        "utf-8"
                    )
                else:
                    image_data = user["profileimage"]
                res_data = {
                    "username": user["username"],
                    "email": user["email"],
                    "profileimage": image_data,
                    "created_at": user["created_at"],
                    "updated_at": user["updated_at"],
                }
                return JsonResponse({"user": res_data}, status=200)
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as i:
            return JsonResponse({"error": str(i)}, status=500)
    else:
        return HttpResponse("<h1>Invalid request method</h1>")


@csrf_exempt
def add_income(request):
    if request.method == "POST":
        try:
           
            user_id = request.POST.get("userId")
            income_amount = request.POST.get("amount")

           
            if not user_id or not income_amount:
                return JsonResponse(
                    {"error": "Both user ID and amount are mandatory fields"}, status=400
                )

           
            if not user_collection.find_one({"_id": ObjectId(user_id)}):
                return JsonResponse({"error": "User not found"}, status=404)

           
            income_entry = EntrieModel(
                userId=user_id, entry_type="income", amount=float(income_amount), category=None
            )

           
            new_entry_id = entrie_collection.insert_one(income_entry.__dict__).inserted_id

           
            user_collection.update_one(
                {"_id": ObjectId(user_id)}, {"$addToSet": {"entries": new_entry_id}}
            )

           
            response = {
                "message": "Income entry recorded successfully",
                "entry": {
                    "id": str(new_entry_id),
                    "type": "income",
                    "amount": income_amount,
                    "category": "None",
                },
            }
            return JsonResponse(response, status=201)

        except Exception as err:
            return JsonResponse({"error": f"An error occurred: {str(err)}"}, status=500)

    return HttpResponse("Request method not allowed", status=405)



@csrf_exempt
def add_expense(request):
    if request.method == "POST":
        try:
            user_id = request.POST.get("userId")
            expense_amount = request.POST.get("amount")
            expense_category = request.POST.get("category")
            if not all([user_id, expense_amount, expense_category]):
                return JsonResponse(
                    {"error": "User ID, amount, and category are all required fields"},
                    status=400
                )
            if not user_collection.find_one({"_id": ObjectId(user_id)}):
                return JsonResponse({"error": "User does not exist"}, status=404)
            expense_entry = EntrieModel(
                userId=user_id, entry_type="expense", amount=expense_amount, category=expense_category
            )
            new_expense_id = entrie_collection.insert_one(expense_entry.__dict__).inserted_id

            # Link expense entry to the user's list of entries
            user_collection.update_one(
                {"_id": ObjectId(user_id)}, {"$push": {"entries": new_expense_id}}
            )

            # Construct response data
            response = {
                "message": "Expense entry added successfully",
                "entry_details": {
                    "id": str(new_expense_id),
                    "type": "expense",
                    "amount": expense_amount,
                    "category": expense_category,
                }
            }
            return JsonResponse(response, status=201)

        except Exception as err:
            return JsonResponse({"error": f"Error occurred: {str(err)}"}, status=500)

    return HttpResponse("Invalid request method", status=405)

def get_enteries(request, userId):
    if request.method == "GET":
        try:
            entries = entrie_collection.find({"userId": userId})
            entry_list = []
            for entry in entries:
                entry_list.append(
                    {
                        "entry_id": str(entry["_id"]),
                        "entry_type": entry["entry_type"],
                        "amount": entry["amount"],
                        "category": entry["category"],
                        "date": entry["date"],
                    }
                )
            return JsonResponse({"message": "ABC", "entries": entry_list}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
       return HttpResponse("<p>Invalid request method</p>", status=405)


@csrf_exempt
def modify_expense_entry(request, entry_id):
    if request.method == "POST":
        try:
            entry_details = {
                "entry_type": "expense",
                "date": datetime.now().isoformat(),
            }

            amount = request.POST.get("amount")
            category = request.POST.get("category")

            if amount:
                entry_details["amount"] = amount
            if category:
                entry_details["category"] = category

            if not amount and not category:
                return JsonResponse({"error": "No update data provided"}, status=400)

            entry_id_obj = ObjectId(entry_id)
            update_result = entrie_collection.update_one(
                {"_id": entry_id_obj},
                {"$set": entry_details}
            )

            if update_result.modified_count == 0:
                return JsonResponse({"error": "Entry not found or unchanged"}, status=404)

            return JsonResponse(
                {
                    "message": "Expense entry successfully updated",
                    "modified_count": update_result.modified_count
                },
                status=200
            )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return HttpResponse("<p>Invalid request method</p>", status=405)


@csrf_exempt
def modify_income_entry(request, entry_id):
    if request.method == "POST":
        try:
            entry_details = {
                "entry_type": "income",
                "date": datetime.now().isoformat(),
                "category": None
            }

            amount = request.POST.get("amount")

            if amount:
                entry_details["amount"] = amount

            if not amount:
                return JsonResponse({"error": "No data provided to update"}, status=400)

            entry_id_obj = ObjectId(entry_id)
            update_result = entrie_collection.update_one(
                {"_id": entry_id_obj},
                {"$set": entry_details}
            )

            if update_result.modified_count == 0:
                return JsonResponse({"error": "Entry not found or unchanged"}, status=404)

            return JsonResponse(
                {
                    "message": "Income entry successfully updated",
                    "modified_count": update_result.modified_count
                },
                status=200
            )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return HttpResponse("<p>Invalid request method</p>", status=405)


@csrf_exempt
def delete_entry(request, entry_id):
    if request.method == "DELETE":
        try:
            entry_id_obj = ObjectId(entry_id)
            entry_data = entrie_collection.find_one({"_id": entry_id_obj})

            if not entry_data:
                return JsonResponse({"error": "Entry not found"}, status=404)

            user_id = entry_data["userId"]
            delete_result = entrie_collection.delete_one({"_id": entry_id_obj})

            if delete_result.deleted_count == 0:
                return JsonResponse({"error": "Entry deletion failed"}, status=500)

            user_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"entries": entry_id_obj}}
            )

            return JsonResponse({"message": "Entry deleted successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return HttpResponse("<p>Invalid request method</p>", status=405)


@csrf_exempt
def get_summary(request, userId):
    if request.method == "GET":
        try:
            income_entries = entrie_collection.find({"userId": userId, "entry_type": "income"})
            expense_entries = entrie_collection.find({"userId": userId, "entry_type": "expense"})

            total_income = sum(float(entry["amount"]) for entry in income_entries)
            total_expenses = sum(float(entry["amount"]) for entry in expense_entries)
            balance = total_income - total_expenses

            summary_data = {
                "total_income": total_income,
                "total_expenses": total_expenses,
                "balance": balance,
            }

            return JsonResponse({"summary": summary_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return HttpResponse("<p>Invalid request method</p>", status=405)




