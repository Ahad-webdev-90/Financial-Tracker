from django.urls import path
from . import views

urlpatterns = [
    path('user/signup/', views.user_register, name='user_signup'),
    path('user/login/', views.user_login, name='user_login'),
    path('getuser/<userId>', views.get_user, name='get_user'),
    path('addincome/', views.add_income, name='add_income'),
    path('addexpence/', views.add_expense, name='add_expence'),
    path('getentry/<userId>', views.get_enteries, name='get_enteries'),
    path('modifyexpensentry/<entry_id>', views.modify_expense_entry, name='modify_expense_entry'),
    path('modifyincomentry/<entry_id>', views.modify_income_entry, name='modify_income_entry'),
    path('deletentry/<entry_id>', views.delete_entry, name='delete_entry'),
    path('getsummary/<userId>', views.get_summary, name='get_summary'),
]
