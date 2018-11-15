from django.shortcuts import render

# Create your views here.
def chess(request):
  return render(request, "chess.html")