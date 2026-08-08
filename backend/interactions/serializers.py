from rest_framework import serializers
from users.serializers import UserSummarySerializer
from .models import Reaction, Comment, Share


class ReactionSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Reaction
        fields = ['id', 'post', 'user', 'reaction_type']
        read_only_fields = ['id', 'post', 'user']

    def validate_reaction_type(self, value):
        if value not in [Reaction.LIKE, Reaction.DISLIKE]:
            raise serializers.ValidationError("Reação inválida. Escolha 'like' ou 'dislike'.")
        return value


class CommentSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'post', 'author', 'created_at']


class ShareSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Share
        fields = ['id', 'post', 'user', 'created_at']
        read_only_fields = ['id', 'post', 'user', 'created_at']
