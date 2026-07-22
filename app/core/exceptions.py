class UserAlreadyExistsException(Exception):
    def __init__(self, email: str):
        self.email = email
        self.message = f"User with email {email} already exists."
        super().__init__(self.message)


class InvalidCredentialsException(Exception):
    def __init__(self):
        self.message = "Incorrect email or password"
        super().__init__(self.message)


class VehicleNotFoundException(Exception):
    def __init__(self):
        self.message = "Vehicle not found"
        super().__init__(self.message)


class DuplicateVehicleException(Exception):
    def __init__(self):
        self.message = "Vehicle already exists"
        super().__init__(self.message)
