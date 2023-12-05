npm install 
npm run dev

# React Assignment Task Documentation

## Simple Navigation

- The UI is defined in `src/components/Header`.

## Home Page

- The UI is defined in `src/pages/home`.

## Roles Page

- The data table is stored in `public/api/roles.json`.
- The API is located in `src/pages/api/roles.ts`.
- To ensure no duplicate role names are allowed, a function called `isRoleNameUnique` is implemented in `src/pages/api/roles.ts` (line 30).
- The UI for the Roles data table list can be found in `src/pages/roles/index.tsx`.
- Role names can be sorted alphabetically, implemented in `src/pages/roles/index.tsx` (line 23).
- To create a new role, use the actions provided in `src/pages/roles/create-role/` along with the reusable Form component `src/forms/GenericCreateForm.tsx`.
  - The API for creating a role using the POST method is located in `src/pages/api/roles.ts` (line 69).
- To update a role, use the actions provided in `src/pages/roles/update-role/` along with the reusable Form component `src/forms/GenericUpdateForm.tsx`.
  - The API for updating a role using the PUT method is located in `src/pages/api/roles.ts` (line 101).
- Validation for roles can be found in `src/forms/validations.ts`.

## Users Page

- The data table is stored in `public/api/users.json`.
- The API is located in `src/pages/api/users.ts`.
- Users can be sorted by date/time in descending order, implemented in `src/pages/roles/index.tsx` (line 33).
- To create a new user, use the actions provided in `src/pages/users/create-user/` along with the reusable Form component `src/forms/GenericCreateForm.tsx`.
  - The API for creating a user using the POST method is located in `src/pages/api/users.ts` (line 77).
- To update a user, use the actions provided in `src/pages/users/update-users/` along with the reusable Form component `src/forms/GenericUpdateForm.tsx`.
  - The API for updating a user using the PUT method is located in `src/pages/api/roles.ts` (line 109).
- Validation for users can be found in `src/forms/validations.ts`.

## Redirection

- After creating or updating a user/role object, redirection is handled in:
  - `src/forms/GenericCreateForm.tsx` (line 47).
  - `src/forms/GenericUpdateForm.tsx` (line 52).

## Performance

- Each create/update action takes approximately 2 seconds:
  - `src/forms/GenericCreateForm.tsx` (line 44).
  - `src/forms/GenericUpdateForm.tsx` (line 45).
