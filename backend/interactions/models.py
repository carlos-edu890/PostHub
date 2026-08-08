import uuid
from django.conf import settings
from django.db import models

class Reaction(models.Model):
    LIKE = 'like'
    DISLIKE = 'dislike'

    REACTION_TYPE_CHOICES = [
        (LIKE, 'Like'),
        (DISLIKE, 'Dislike'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(
        'posts.Post',
        related_name='reactions',
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reactions'
    )
    reaction_type = models.CharField(max_length=10, choices=REACTION_TYPE_CHOICES)

    class Meta:
        unique_together = ('post', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.reaction_type} on {self.post.title}"


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(
        'posts.Post',
        related_name='comments',
        on_delete=models.CASCADE
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"


class Share(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(
        'posts.Post',
        related_name='shares',
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shares'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Share by {self.user.username} on {self.post.title}"

