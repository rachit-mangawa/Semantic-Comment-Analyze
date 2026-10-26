from .router import router


def warmup():
    from .nlp_engine import warmup as _warmup

    return _warmup()


__all__ = ["router", "warmup"]
