#!/bin/bash
# Copy generated images from the app data folder to the public assets directory

SRC_DIR="/home/dhruvik/.gemini/antigravity/brain/2ef267a8-5366-4e9e-aed9-6eded031a48b"
DEST_DIR="/home/dhruvik/Workspace/charlie-charging-project/charlie-charging-latest-frontend/public/assets"

echo "Copying premium EV charging images from app data..."

cp "$SRC_DIR/ev_hero_dashboard_1779685021060.png" "$DEST_DIR/ev_hero_dashboard.png"
cp "$SRC_DIR/ev_fleet_1779685050960.png" "$DEST_DIR/ev_fleet.png"
cp "$SRC_DIR/ev_energy_grid_1779685068972.png" "$DEST_DIR/ev_energy_grid.png"
cp "$SRC_DIR/ev_multi_family_1779685088375.png" "$DEST_DIR/ev_multi_family.png"
cp "$SRC_DIR/ev_car_builders_1779685109246.png" "$DEST_DIR/ev_car_builders.png"
cp "$SRC_DIR/ev_installer_1779685131698.png" "$DEST_DIR/ev_installer.png"
cp "$SRC_DIR/ev_network_owner_1779685150232.png" "$DEST_DIR/ev_network_owner.png"

echo "Copy complete! Premium images are now in $DEST_DIR."
