from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from posts.models import Post
from .models import Reaction, Comment, Share
from .serializers import ReactionSerializer, CommentSerializer, ShareSerializer


class ReactToPostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        reaction_type = request.data.get('type') or request.data.get('reaction_type')

        if reaction_type not in [Reaction.LIKE, Reaction.DISLIKE]:
            return Response(
                {'detail': "Tipo de reação inválido. Use 'like' ou 'dislike'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_reaction = Reaction.objects.filter(post=post, user=request.user).first()

        if existing_reaction:
            if existing_reaction.reaction_type == reaction_type:
                existing_reaction.delete()
                return Response(
                    {'detail': 'Reação removida com sucesso.', 'action': 'removed'},
                    status=status.HTTP_200_OK
                )
            else:
                existing_reaction.reaction_type = reaction_type
                existing_reaction.save()
                serializer = ReactionSerializer(existing_reaction)
                return Response(
                    {'detail': 'Reação atualizada com sucesso.', 'action': 'updated', 'reaction': serializer.data},
                    status=status.HTTP_200_OK
                )
        else:
            reaction = Reaction.objects.create(post=post, user=request.user, reaction_type=reaction_type)
            serializer = ReactionSerializer(reaction)
            return Response(
                {'detail': 'Reação registrada com sucesso.', 'action': 'created', 'reaction': serializer.data},
                status=status.HTTP_201_CREATED
            )


class PostCommentsView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        comments = post.comments.select_related('author').all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        content = request.data.get('content')
        if not content:
            return Response({'content': ['Este campo é obrigatório.']}, status=status.HTTP_400_BAD_REQUEST)

        comment = Comment.objects.create(post=post, author=request.user, content=content)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SharePostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        share = Share.objects.create(post=post, user=request.user)
        post.shares_count += 1
        post.save()

        serializer = ShareSerializer(share)
        return Response({
            'detail': 'Post compartilhado com sucesso.',
            'shares_count': post.shares_count,
            'share': serializer.data
        }, status=status.HTTP_201_CREATED)
