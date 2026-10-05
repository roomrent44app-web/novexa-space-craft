ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_amount_paise_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_amount_paise_check CHECK (amount_paise >= 0);
COMMENT ON CONSTRAINT subscriptions_amount_paise_check ON public.subscriptions IS 'Allows ₹0 free-trial activations alongside paid plans';