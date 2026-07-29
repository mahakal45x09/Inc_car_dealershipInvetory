text = """· Design: This is a chance to show your creativity. The application should be visually appealing, responsive, and provide a great user experience.

Process & Technical Guidelines

1. Test-Driven Development (TDD)

Write tests before implementing functionality. We expect to see a clear "Red-Green-Refactor" pattern in your commit history, especially for the backend logic. Aim for high test coverage with meaningful test cases.

2. Clean Coding Practices

Write clean, readable, and maintainable code. Follow SOLID principles and other best practices in software design. Your code should be well-documented with meaningful comments and clear naming conventions.

3. Git & Version Control

Use Git for version control. Commit your changes frequently with clear, descriptive messages that narrate your development journey.

"""
with open('b:/Inc_car_dealershipInvetory/promat.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()
# insert text before '4. AI Usage Policy'
for i, line in enumerate(lines):
    if '4. AI Usage Policy' in line:
        lines.insert(i, text)
        break
with open('b:/Inc_car_dealershipInvetory/promat.md', 'w', encoding='utf-8') as f:
    f.writelines(lines)
