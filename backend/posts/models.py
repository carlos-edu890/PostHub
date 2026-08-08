import uuid
from django.conf import settings
from django.db import models

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shares_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class PostBlock(models.Model):
    TEXT = 'text'
    IMAGE = 'image'
    VIDEO = 'video'
    LINK = 'link'

    BLOCK_TYPE_CHOICES = [
        (TEXT, 'Text'),
        (IMAGE, 'Image'),
        (VIDEO, 'Video'),
        (LINK, 'Link'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(
        Post,
        related_name='blocks',
        on_delete=models.CASCADE
    )
    order = models.PositiveIntegerField()
    block_type = models.CharField(max_length=10, choices=BLOCK_TYPE_CHOICES)
    content = models.TextField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.post.title} - Block {self.order} ({self.block_type})"

