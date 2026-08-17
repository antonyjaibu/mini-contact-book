from django.db.models import Q
from rest_framework import viewsets, permissions

from .models import Contact
from .serializers import ContactSerializer


class ContactViewSet(viewsets.ModelViewSet):
    """
    CRUD for contacts. Each user only ever sees / edits their own contacts.
    Supports ?search= for a simple case-insensitive search across
    name, email, phone, and company.
    """
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Contact.objects.filter(owner=self.request.user)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(email__icontains=search)
                | Q(phone__icontains=search)
                | Q(company__icontains=search)
            )
        return queryset.order_by('name')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
