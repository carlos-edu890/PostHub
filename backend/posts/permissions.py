from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Permissão customizada que apenas permite que os autores de um objeto o editem ou excluam.
    Qualquer requisição de leitura (GET, HEAD, OPTIONS) é permitida para qualquer usuário.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        author = getattr(obj, 'author', None) or getattr(obj, 'user', None)
        return author == request.user
