from django.contrib import admin

from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'company', 'owner')
    list_filter = ('owner',)
    search_fields = ('name', 'email', 'phone', 'company')
