import enum

class ModerationStatus(str, enum.Enum):
    on_moderation = 'on_moderation'
    approved = 'approved'
    rejected = 'rejected'