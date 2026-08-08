from django.urls import path
from .views import ReactToPostView, PostCommentsView, SharePostView

urlpatterns = [
    path('posts/<uuid:post_id>/react/', ReactToPostView.as_view(), name='post-react'),
    path('posts/<uuid:post_id>/comments/', PostCommentsView.as_view(), name='post-comments'),
    path('posts/<uuid:post_id>/share/', SharePostView.as_view(), name='post-share'),
]
