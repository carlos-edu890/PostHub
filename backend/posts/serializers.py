from rest_framework import serializers
from users.serializers import UserSummarySerializer
from .models import Post, PostBlock


class PostBlockSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)

    class Meta:
        model = PostBlock
        fields = ['id', 'order', 'block_type', 'content']


class PostSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    blocks = PostBlockSerializer(many=True, required=False)
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    text_preview = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'author',
            'title',
            'created_at',
            'updated_at',
            'shares_count',
            'blocks',
            'likes_count',
            'dislikes_count',
            'comments_count',
            'text_preview',
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'shares_count']

    def get_likes_count(self, obj):
        if hasattr(obj, 'likes_count'):
            return obj.likes_count
        return obj.reactions.filter(reaction_type='like').count()

    def get_dislikes_count(self, obj):
        if hasattr(obj, 'dislikes_count'):
            return obj.dislikes_count
        return obj.reactions.filter(reaction_type='dislike').count()

    def get_comments_count(self, obj):
        if hasattr(obj, 'comments_count'):
            return obj.comments_count
        return obj.comments.count()

    def get_text_preview(self, obj):
        text_blocks = [b.content for b in obj.blocks.all() if b.block_type == 'text']
        if not text_blocks:
            return ""
        full_text = " ".join(text_blocks)
        lines = full_text.splitlines()
        preview = " ".join(lines[:2])
        return preview[:200]

    def create(self, validated_data):
        blocks_data = validated_data.pop('blocks', [])
        post = Post.objects.create(**validated_data)
        for index, block_data in enumerate(blocks_data):
            if 'order' not in block_data:
                block_data['order'] = index + 1
            PostBlock.objects.create(post=post, **block_data)
        return post

    def update(self, instance, validated_data):
        blocks_data = validated_data.pop('blocks', None)
        instance.title = validated_data.get('title', instance.title)
        instance.save()

        if blocks_data is not None:
            instance.blocks.all().delete()
            for index, block_data in enumerate(blocks_data):
                if 'order' not in block_data:
                    block_data['order'] = index + 1
                PostBlock.objects.create(post=instance, **block_data)

        return instance
