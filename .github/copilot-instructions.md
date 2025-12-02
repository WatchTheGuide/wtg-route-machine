# GitHub Copilot Instructions for WTG Route Machine

You are working on **WTG Route Machine** - a lightweight OSRM (Open Source Routing Machine) instance optimized for city-based pedestrian routing, designed for AWS deployment.

## Project Overview

- **Purpose**: City walking tour routing service
- **Tech Stack**: OSRM Backend (C++/Docker), Bash scripts, osmium-tool
- **Profile**: Pedestrian (`foot`) - optimized for sidewalks, paths, tourist attractions
- **Deployment**: AWS (EC2/ECS) with minimal resource footprint (2GB RAM target)

## Development Workflow

### Branch Strategy

1. **Main Branch Protection**

   - Never commit directly to `main`
   - All changes must go through feature branches
   - Branch naming convention: `feature/description`, `fix/issue-name`, `refactor/component`

2. **Feature Branch Workflow**

   ```bash
   # Create feature branch
   git checkout -b feature/new-city-support

   # Work on changes
   # ... make changes ...

   # Before committing: test, lint, validate
   # Commit and push
   git add -A
   git commit -m "descriptive message"
   git push origin feature/new-city-support
   ```

3. **Branch Naming Examples**
   - `feature/add-poznan-city` - adding new city support
   - `feature/api-wrapper` - new API wrapper implementation
   - `fix/bbox-coordinates` - fixing bbox issues
   - `refactor/extract-script` - refactoring extraction logic
   - `docs/update-readme` - documentation updates

### Pre-Commit Checklist

Before committing ANY changes, ensure:

#### 1. Code Testing

```bash
# Test shell scripts syntax
bash -n scripts/*.sh

# Test Docker containers build/run
docker-compose config  # validate docker-compose.yml

# Test city extraction (if modified extract-city.sh)
./scripts/extract-city.sh malopolskie krakow

# Test OSRM processing (if modified prepare-city-osrm.sh)
./scripts/prepare-city-osrm.sh krakow foot

# Test server startup (if modified run-city-server.sh)
./scripts/run-city-server.sh krakow 5001
docker logs osrm-krakow
```

#### 2. Linting & Style

```bash
# Shell script linting (if shellcheck is available)
shellcheck scripts/*.sh

# Check for common issues:
# - Proper shebang (#!/usr/bin/env bash)
# - Proper error handling (set -e)
# - Quoted variables ("$VAR")
# - Exit codes validation
```

#### 3. Build Validation

```bash
# Ensure Docker images build successfully
docker pull ghcr.io/project-osrm/osrm-backend:latest

# Validate all scripts are executable
ls -la scripts/*.sh

# Check for broken symlinks or missing files
find . -type l -! -exec test -e {} \; -print
```

#### 4. Documentation

- Update README.md if adding new features
- Update REQUIREMENTS.md if changing architecture
- Add inline comments for complex logic
- Document new city bbox coordinates

### Commit Message Format

Use descriptive commit messages following this pattern:

```
<type>: <short summary>

<detailed description>

<impact/breaking changes if any>
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

**Examples:**

```
feat: Add Poznań city support with bbox extraction

- Add Poznań to extract-city.sh case statement
- Define bbox coordinates: 16.8,52.3,17.0,52.5
- Update README with Poznań examples

fix: Correct Wrocław bbox coordinates

The previous coordinates were too narrow and excluded suburbs.
Expanded bbox from 16.8,51.0,17.2,51.25 to 16.7,50.95,17.3,51.3

refactor: Simplify extract-city.sh bbox definition

Replace associative arrays with case statement for better
shell compatibility (zsh/bash differences)
```

## Code Guidelines

### Shell Scripts

1. **Always use proper shebang**

   ```bash
   #!/usr/bin/env bash
   ```

2. **Enable strict mode**

   ```bash
   set -e  # Exit on error
   set -u  # Exit on undefined variable (when appropriate)
   ```

3. **Quote variables**

   ```bash
   # Good
   echo "Processing: $CITY"
   docker run -v "$(pwd)/osrm-data:/data" ...

   # Bad
   echo "Processing: $CITY"
   docker run -v $(pwd)/osrm-data:/data ...
   ```

4. **Validate inputs**

   ```bash
   if [ -z "$CITY" ]; then
       echo "Error: City parameter required"
       exit 1
   fi
   ```

5. **Provide helpful error messages**
   ```bash
   if [ ! -f "$MAP_FILE" ]; then
       echo "Error: Map file not found: $MAP_FILE"
       echo "Run: ./scripts/download-map.sh $REGION"
       exit 1
   fi
   ```

### Adding New Cities

When adding support for a new city:

1. **Find bounding box coordinates** at https://boundingbox.klokantech.com/
2. **Add to `extract-city.sh`** in the case statement
3. **Test extraction** with a small region first
4. **Verify bbox coverage** - ensure city center + suburbs included
5. **Update documentation** - add city to README.md

### Docker Best Practices

1. **Use specific image tags** when possible (not just `latest`)
2. **Volume mounts** should use absolute paths: `$(pwd)/osrm-data`
3. **Container naming** should be descriptive: `osrm-{city}`
4. **Port conflicts** - check before binding: `lsof -i :PORT`

### OSRM Profile Customization

If modifying Lua profiles (future):

1. **Test with small dataset** first
2. **Verify routing logic** with known routes
3. **Document profile changes** in comments
4. **Keep backup** of default profiles

## Testing Strategy

### Manual Testing Checklist

For each feature/fix, test:

1. **Happy Path**

   - Basic functionality works as expected
   - Script completes successfully

2. **Edge Cases**

   - Missing files/directories
   - Invalid parameters
   - Network failures (for downloads)

3. **Error Handling**
   - Proper error messages displayed
   - Script exits with non-zero code on failure
   - Resources cleaned up on error

### Integration Testing

For changes affecting multiple components:

```bash
# Full workflow test
./scripts/download-map.sh malopolskie
./scripts/extract-city.sh malopolskie krakow
./scripts/prepare-city-osrm.sh krakow foot
./scripts/run-city-server.sh krakow 5001

# API validation
curl "http://localhost:5001/nearest/v1/foot/19.9385,50.0647"

# Cleanup
docker stop osrm-krakow
docker rm osrm-krakow
```

## Common Pitfalls to Avoid

1. **Don't commit large data files**

   - `.osm.pbf` files should be in `.gitignore`
   - `.osrm.*` files should be in `.gitignore`

2. **Don't hardcode paths**

   - Use relative paths with `$(pwd)`
   - Make paths configurable via variables

3. **Don't assume shell type**

   - Test scripts in both bash and zsh
   - Avoid bash-specific features when possible

4. **Don't leave containers running**

   - Stop test containers after validation
   - Document cleanup steps

5. **Don't skip error handling**
   - Always check exit codes: `if [ $? -ne 0 ]; then`
   - Validate file existence before operations

## Resource Optimization

Keep in mind the AWS deployment target:

- **Target RAM**: 2GB (t3.small)
- **Data size**: Minimize city bbox to essential area
- **Processing time**: Keep under 5 minutes for city processing
- **Container startup**: Should be under 30 seconds

When making changes, consider impact on:

- Memory consumption
- Processing time
- Disk space usage
- API response times

## Getting Help

- **OSRM Documentation**: https://project-osrm.org/docs/
- **Osmium Tool**: https://osmcode.org/osmium-tool/
- **OpenStreetMap**: https://wiki.openstreetmap.org/
- **Geofabrik Downloads**: https://download.geofabrik.de/

## Summary

**Remember**: Quality > Speed

- Always test before committing
- Use feature branches
- Write descriptive commits
- Document your changes
- Think about resource constraints
