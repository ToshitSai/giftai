# backend/app/schemas.py
from marshmallow import Schema, fields, validate

class CustomerRegisterSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True, validate=validate.Length(max=150))
    phone = fields.String(validate=validate.Length(max=20))
    password = fields.String(required=True, validate=validate.Length(min=8, max=128))

class MessageGenerationSchema(Schema):
    customer_id = fields.Integer(required=True)
    recipient_id = fields.Integer(required=False, allow_none=True)
    recipient_name = fields.String(required=False, allow_none=True)
    occasion_id = fields.Integer(required=False, allow_none=True)
    occasion_name = fields.String(required=False, allow_none=True)
    tone_id = fields.Integer(required=False, allow_none=True)
    tone_name = fields.String(required=False, allow_none=True)
    relationship = fields.String(required=True, validate=validate.Length(min=1))
    extra_note = fields.String(required=False, allow_none=True)

class MessageEditSchema(Schema):
    message_text = fields.String(required=True, validate=validate.Length(min=1))
    edited_by = fields.String(required=False)
