"""Add reservas table

Revision ID: 719d44b26651
Revises: ec4ed434734f
Create Date: 2024-09-11 21:41:52.429664

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '719d44b26651'
down_revision = 'ec4ed434734f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('reserva',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre_cliente', sa.String(length=100), nullable=False),
    sa.Column('email_cliente', sa.String(length=100), nullable=False),
    sa.Column('mensaje', sa.Text(), nullable=True),
    sa.Column('fotos', sa.String(length=200), nullable=True),
    sa.Column('fecha_reserva', sa.DateTime(), nullable=True),
    sa.Column('producto_id', sa.Integer(), nullable=False),
    sa.Column('cliente_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['cliente_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['producto_id'], ['product.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('image_url',
               existing_type=sa.VARCHAR(length=200),
               type_=sa.String(length=900),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('image_url',
               existing_type=sa.String(length=900),
               type_=sa.VARCHAR(length=200),
               existing_nullable=True)

    op.drop_table('reserva')
    # ### end Alembic commands ###
