from datetime import timedelta
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class FeedTop24hPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 50


class SearchPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


def get_annotated_posts_queryset():
    return Post.objects.select_related('author').prefetch_related(
        'blocks', 'reactions', 'comments'
    ).annotate(
        likes_count=Count('reactions', filter=Q(reactions__reaction_type='like'), distinct=True),
        dislikes_count=Count('reactions', filter=Q(reactions__reaction_type='dislike'), distinct=True),
        comments_count=Count('comments', distinct=True)
    )


class PostViewSet(viewsets.ModelViewSet):
    queryset = get_annotated_posts_queryset()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return get_annotated_posts_queryset()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny], url_path='feed/top24h')
    def feed_top24h(self, request):
        last_24h = timezone.now() - timedelta(hours=24)
        qs = self.get_queryset().filter(created_at__gte=last_24h).order_by('-likes_count', '-created_at')

        paginator = FeedTop24hPagination()
        page = paginator.paginate_queryset(qs, request)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='me/top')
    def me_top(self, request):
        qs = self.get_queryset().filter(author=request.user).order_by('-likes_count', '-created_at')
        post = qs.first()
        if not post:
            return Response({'detail': 'Nenhum post encontrado para este usuário.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='me')
    def me_posts(self, request):
        ordering = request.query_params.get('ordering', '-created_at')
        qs = self.get_queryset().filter(author=request.user)

        ordering_map = {
            '-likes': '-likes_count',
            'likes': 'likes_count',
            '-dislikes': '-dislikes_count',
            'dislikes': 'dislikes_count',
            '-comments': '-comments_count',
            'comments': 'comments_count',
        }

        order_by_field = ordering_map.get(ordering, ordering)
        try:
            qs = qs.order_by(order_by_field)
        except Exception:
            qs = qs.order_by('-created_at')

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny], url_path='search')
    def search(self, request):
        query = request.query_params.get('q', '')
        qs = self.get_queryset().filter(title__icontains=query).order_by('-created_at')

        paginator = SearchPagination()
        page = paginator.paginate_queryset(qs, request)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
