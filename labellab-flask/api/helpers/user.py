from api.extensions import db, ma
from api.models.Projects import Project
from api.models.ProjectMembers import ProjectMember
from api.models.Team import Team
from api.models.User import User
from api.serializers.user import UserSchema
from api.serializers.project import ProjectSchema
from api.serializers.team import TeamSchema

user_schema = UserSchema()
users_schema = UserSchema(many=True)
project_schema = ProjectSchema()
team_schema = TeamSchema()

def to_json(user):
    """
    Returns a user JSON object
    """
    user_detail = user_schema.dump(user).data
    data = get_data(user_detail["id"])
    user_detail["all_teams"] = data["all_teams"]
    user_detail["all_projects"] = data["all_projects"]

    return user_detail

def find_by_email(email):
    """
    query user on their email
    """
    return User.query.filter_by(email=email).first()

def find_by_user_id(_id):
    """
    query user on their id
    """
    user = User.query.filter_by(id=_id).first()
    return user_schema.dump(user).data

def find_by_username(username):
    """
    query user on their username
    """
    user = User.query.filter_by(username=username).first()
    return user_schema.dump(user).data

def delete_by_id(_id):
    """
    Delete user by their id
    """
    User.query.filter_by(id=_id).delete()
    db.session.commit()
    
def delete_by_email(email):
    """
    Delete user by their email
    """
    User.query.filter_by(email=email).delete()
    db.session.commit()

def get_data(user_id):
    all_projects = []
    all_teams = []
    queries = db.session.query(
            User, ProjectMember, Team, Project
        ).join(
            ProjectMember, User.id == ProjectMember.user_id
        ).join(
            Team, ProjectMember.team_id == Team.id
        ).join(
            Project, Team.project_id == Project.id
        ).filter(
            User.id == user_id
        )
    for project in queries:
        all_projects.append(project_schema.dump(project.Project).data)
    
    for team in queries:
        all_teams.append(team_schema.dump(team.Team).data)
        
    return {"all_projects": all_projects,
            "all_teams": all_teams}

def get_user_roles(user_id, project_id):
    all_roles = []
    queries = db.session.query(
            User, ProjectMember, Team, Project
        ).join(
            ProjectMember, User.id == ProjectMember.user_id
        ).join(
            Team, ProjectMember.team_id == Team.id
        ).join(
            Project, Team.project_id == Project.id
        ).filter(
            User.id == user_id,
            Project.id == project_id
        )
    for team in queries:
        all_roles.append(team_schema.dump(team.Team).data["role"])
        
    return all_roles

def get_teams_of_user_in_project(user_id, project_id):
    all_team_ids = []
    queries = db.session.query(
            User, ProjectMember, Team, Project
        ).join(
            ProjectMember, User.id == ProjectMember.user_id
        ).join(
            Team, ProjectMember.team_id == Team.id
        ).join(
            Project, Team.project_id == Project.id
        ).filter(
            User.id == user_id,
            Project.id == project_id
        )
    for team in queries:
        all_team_ids.append(team_schema.dump(team.Team).data["id"])
        
    return all_team_ids

def save(user):
    """
    Save a user to the database.
    This includes creating a new user and editing one.
    """
    db.session.add(user)
    db.session.commit()
    user_detail = user_schema.dump(user).data
    data = get_data(user_detail["id"])
    user_detail["all_teams"] = data["all_teams"]
    user_detail["all_projects"] = data["all_projects"]

    return user_detail