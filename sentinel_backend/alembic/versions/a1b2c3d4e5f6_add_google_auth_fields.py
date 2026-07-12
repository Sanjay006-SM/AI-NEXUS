"""Add google auth fields

Revision ID: a1b2c3d4e5f6
Revises: 78928ff61f82
Create Date: 2026-07-09 06:46:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '78928ff61f82'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('google_id', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('provider', sa.String(length=50), server_default='LOCAL', nullable=True))
    op.add_column('users', sa.Column('profile_picture', sa.String(length=1024), nullable=True))
    op.create_index(op.f('ix_users_google_id'), 'users', ['google_id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_users_google_id'), table_name='users')
    op.drop_column('users', 'profile_picture')
    op.drop_column('users', 'provider')
    op.drop_column('users', 'google_id')
